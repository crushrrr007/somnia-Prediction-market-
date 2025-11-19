// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PredictionMarket
 * @dev A decentralized prediction market platform integrated with Somnia Data Streams
 * @notice This contract manages market creation, betting, and settlement
 */
contract PredictionMarket {
    struct Market {
        uint256 id;
        string question;
        string[] outcomes;
        uint256 endTime;
        uint256 resolutionTime;
        address creator;
        bool resolved;
        uint256 winningOutcome;
        uint256 totalPool;
        MarketStatus status;
    }

    struct Bet {
        address bettor;
        uint256 marketId;
        uint256 outcomeIndex;
        uint256 amount;
        uint256 timestamp;
        bool claimed;
    }

    enum MarketStatus {
        Active,
        Closed,
        Resolved,
        Cancelled
    }

    // State variables
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(uint256 => uint256)) public outcomePools; // marketId => outcomeIndex => amount
    mapping(uint256 => Bet[]) public marketBets; // marketId => bets
    mapping(address => uint256[]) public userBets; // user => betIds

    uint256 public marketCount;
    uint256 public constant MIN_BET = 0.001 ether;
    uint256 public constant PLATFORM_FEE = 2; // 2%

    address public owner;
    uint256 public platformFees;

    // Events for Data Streams integration
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        string[] outcomes,
        uint256 endTime,
        address indexed creator,
        uint256 timestamp
    );

    event BetPlaced(
        uint256 indexed marketId,
        address indexed bettor,
        uint256 outcomeIndex,
        uint256 amount,
        uint256 newPoolTotal,
        uint256 timestamp
    );

    event MarketResolved(
        uint256 indexed marketId,
        uint256 winningOutcome,
        uint256 totalPool,
        uint256 timestamp
    );

    event BetClaimed(
        uint256 indexed marketId,
        address indexed bettor,
        uint256 payout,
        uint256 timestamp
    );

    event OddsUpdated(
        uint256 indexed marketId,
        uint256[] odds,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier marketExists(uint256 _marketId) {
        require(_marketId < marketCount, "Market does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Creates a new prediction market
     * @param _question The market question
     * @param _outcomes Array of possible outcomes
     * @param _duration Duration in seconds until market closes
     */
    function createMarket(
        string memory _question,
        string[] memory _outcomes,
        uint256 _duration
    ) external returns (uint256) {
        require(_outcomes.length >= 2, "Need at least 2 outcomes");
        require(_duration > 0, "Invalid duration");

        uint256 marketId = marketCount++;

        markets[marketId] = Market({
            id: marketId,
            question: _question,
            outcomes: _outcomes,
            endTime: block.timestamp + _duration,
            resolutionTime: 0,
            creator: msg.sender,
            resolved: false,
            winningOutcome: 0,
            totalPool: 0,
            status: MarketStatus.Active
        });

        emit MarketCreated(
            marketId,
            _question,
            _outcomes,
            block.timestamp + _duration,
            msg.sender,
            block.timestamp
        );

        return marketId;
    }

    /**
     * @dev Places a bet on a specific outcome
     * @param _marketId The market ID
     * @param _outcomeIndex Index of the outcome to bet on
     */
    function placeBet(uint256 _marketId, uint256 _outcomeIndex)
        external
        payable
        marketExists(_marketId)
    {
        Market storage market = markets[_marketId];

        require(market.status == MarketStatus.Active, "Market not active");
        require(block.timestamp < market.endTime, "Market closed");
        require(_outcomeIndex < market.outcomes.length, "Invalid outcome");
        require(msg.value >= MIN_BET, "Bet below minimum");

        // Update pools
        outcomePools[_marketId][_outcomeIndex] += msg.value;
        market.totalPool += msg.value;

        // Create bet record
        Bet memory newBet = Bet({
            bettor: msg.sender,
            marketId: _marketId,
            outcomeIndex: _outcomeIndex,
            amount: msg.value,
            timestamp: block.timestamp,
            claimed: false
        });

        marketBets[_marketId].push(newBet);
        userBets[msg.sender].push(_marketId);

        emit BetPlaced(
            _marketId,
            msg.sender,
            _outcomeIndex,
            msg.value,
            outcomePools[_marketId][_outcomeIndex],
            block.timestamp
        );

        // Emit updated odds
        _emitOddsUpdate(_marketId);
    }

    /**
     * @dev Resolves a market with the winning outcome
     * @param _marketId The market ID
     * @param _winningOutcome Index of the winning outcome
     */
    function resolveMarket(uint256 _marketId, uint256 _winningOutcome)
        external
        onlyOwner
        marketExists(_marketId)
    {
        Market storage market = markets[_marketId];

        require(market.status == MarketStatus.Active, "Market not active");
        require(block.timestamp >= market.endTime, "Market still active");
        require(!market.resolved, "Already resolved");
        require(_winningOutcome < market.outcomes.length, "Invalid outcome");

        market.resolved = true;
        market.winningOutcome = _winningOutcome;
        market.resolutionTime = block.timestamp;
        market.status = MarketStatus.Resolved;

        emit MarketResolved(
            _marketId,
            _winningOutcome,
            market.totalPool,
            block.timestamp
        );
    }

    /**
     * @dev Claims winnings for a bet
     * @param _marketId The market ID
     * @param _betIndex Index of the bet in the market's bet array
     */
    function claimWinnings(uint256 _marketId, uint256 _betIndex)
        external
        marketExists(_marketId)
    {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved");

        Bet storage bet = marketBets[_marketId][_betIndex];
        require(bet.bettor == msg.sender, "Not your bet");
        require(!bet.claimed, "Already claimed");
        require(bet.outcomeIndex == market.winningOutcome, "Not winning bet");

        bet.claimed = true;

        // Calculate payout
        uint256 winningPool = outcomePools[_marketId][market.winningOutcome];
        uint256 totalPool = market.totalPool;

        // Payout = (bet amount / winning pool) * (total pool - platform fee)
        uint256 platformCut = (totalPool * PLATFORM_FEE) / 100;
        uint256 payoutPool = totalPool - platformCut;
        uint256 payout = (bet.amount * payoutPool) / winningPool;

        platformFees += platformCut;

        payable(msg.sender).transfer(payout);

        emit BetClaimed(_marketId, msg.sender, payout, block.timestamp);
    }

    /**
     * @dev Calculates current odds for all outcomes
     * @param _marketId The market ID
     */
    function getOdds(uint256 _marketId)
        external
        view
        marketExists(_marketId)
        returns (uint256[] memory)
    {
        Market storage market = markets[_marketId];
        uint256[] memory odds = new uint256[](market.outcomes.length);

        if (market.totalPool == 0) {
            // Equal odds if no bets placed
            for (uint256 i = 0; i < market.outcomes.length; i++) {
                odds[i] = 100 / market.outcomes.length;
            }
        } else {
            for (uint256 i = 0; i < market.outcomes.length; i++) {
                // Odds as percentage of total pool
                odds[i] = (outcomePools[_marketId][i] * 100) / market.totalPool;
            }
        }

        return odds;
    }

    /**
     * @dev Gets all bets for a specific market
     * @param _marketId The market ID
     */
    function getMarketBets(uint256 _marketId)
        external
        view
        marketExists(_marketId)
        returns (Bet[] memory)
    {
        return marketBets[_marketId];
    }

    /**
     * @dev Gets all markets a user has bet on
     * @param _user The user address
     */
    function getUserMarkets(address _user)
        external
        view
        returns (uint256[] memory)
    {
        return userBets[_user];
    }

    /**
     * @dev Gets market details
     * @param _marketId The market ID
     */
    function getMarket(uint256 _marketId)
        external
        view
        marketExists(_marketId)
        returns (Market memory)
    {
        return markets[_marketId];
    }

    /**
     * @dev Internal function to emit odds updates
     */
    function _emitOddsUpdate(uint256 _marketId) internal {
        Market storage market = markets[_marketId];
        uint256[] memory odds = new uint256[](market.outcomes.length);

        for (uint256 i = 0; i < market.outcomes.length; i++) {
            if (market.totalPool > 0) {
                odds[i] = (outcomePools[_marketId][i] * 100) / market.totalPool;
            } else {
                odds[i] = 100 / market.outcomes.length;
            }
        }

        emit OddsUpdated(_marketId, odds, block.timestamp);
    }

    /**
     * @dev Allows owner to withdraw platform fees
     */
    function withdrawFees() external onlyOwner {
        uint256 amount = platformFees;
        platformFees = 0;
        payable(owner).transfer(amount);
    }

    /**
     * @dev Emergency function to close a market
     */
    function closeMarket(uint256 _marketId)
        external
        onlyOwner
        marketExists(_marketId)
    {
        markets[_marketId].status = MarketStatus.Closed;
    }

    receive() external payable {}
}
