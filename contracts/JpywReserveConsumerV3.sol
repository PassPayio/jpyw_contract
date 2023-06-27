// SPDX-License-Identifier:MIT
pragma solidity = 0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JpywReserveConsumerV3 is Ownable {
    struct Phase {
        uint16 id;
        AggregatorV3Interface porFeed;
    }

    Phase private currentFeed;
    mapping(uint16 => AggregatorV3Interface) public porFeedsMap;
    
    uint256 constant private MAX_ID = 2**80 - 1;
    /** Function constructor */ 
    constructor(address _porFeedAddress) public Ownable() {
        uint16 id = currentFeed.id + 1;
        currentFeed = Phase(id, AggregatorV3Interface(_porFeedAddress));
        porFeedsMap[id] = AggregatorV3Interface(_porFeedAddress);
    }

    /*
   * Internal
   */
    function setAggregator(address _porFeedAddress)
        external
        onlyOwner()
    {
        uint16 id = currentFeed.id + 1;
        currentFeed = Phase(id, AggregatorV3Interface(_porFeedAddress));
        porFeedsMap[id] = AggregatorV3Interface(_porFeedAddress);
    }

     /**
   * @notice returns the current phase's aggregator address.
   */
    function getCurrentAggregator()
        external
        view
    returns (address)
    {
        return address(currentFeed.porFeed);
    }

    /**
    * Returns the latest price
     */
    function getLatestReserve() public view returns (int) {
        Phase memory current = currentFeed;
        (
            /* uint80 roundId */,
            int answer,
            /* uint256 startedAt */,
            /* uint256 updatedAt */,
            /* uint80 answeredInRound */
        ) = current.porFeed.latestRoundData();
        return answer;
    }
    
    /**
    * @notice get data about a round. Consumers are encouraged to check
    * that they're receiving fresh data by inspecting the updatedAt and
    * answeredInRound return values.
    * Note that different underlying implementations of AggregatorV3Interface
    * have slightly different semantics for some of the return values. Consumers
    * should determine what implementations they expect to receive
    * data from and validate that they can properly handle return data from all
    * of them.
    * @param _roundId the requested round ID as presented through the proxy, this
    * is made up of the aggregator's round ID with the phase ID encoded in the
    * two highest order bytes
    * @return roundId is the round ID from the aggregator for which the data was
    * retrieved combined with an phase to ensure that round IDs get larger as
    * time moves forward.
    * @return answer is the answer for the given round
    * @return startedAt is the timestamp when the round was started.
    * (Only some AggregatorV3Interface implementations return meaningful values)
    * @return updatedAt is the timestamp when the round last was updated (i.e.
    * answer was last computed)
    * @return answeredInRound is the round ID of the round in which the answer
    * was computed.
    * (Only some AggregatorV3Interface implementations return meaningful values)
    * @dev Note that answer and updatedAt may change between queries.
    */
    function getRoundData(uint80 _roundId)
        public
        view
        virtual
        returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
        )
    {
        Phase memory current = currentFeed;
        return current.porFeed.getRoundData(_roundId);
    }

    /**
    * @notice get data about the latest round. Consumers are encouraged to check
    * that they're receiving fresh data by inspecting the updatedAt and
    * answeredInRound return values.
    * Note that different underlying implementations of AggregatorV3Interface
    * have slightly different semantics for some of the return values. Consumers
    * should determine what implementations they expect to receive
    * data from and validate that they can properly handle return data from all
    * of them.
    * @return roundId is the round ID from the aggregator for which the data was
    * retrieved combined with an phase to ensure that round IDs get larger as
    * time moves forward.
    * @return answer is the answer for the given round
    * @return startedAt is the timestamp when the round was started.
    * (Only some AggregatorV3Interface implementations return meaningful values)
    * @return updatedAt is the timestamp when the round last was updated (i.e.
    * answer was last computed)
    * @return answeredInRound is the round ID of the round in which the answer
    * was computed.
    * (Only some AggregatorV3Interface implementations return meaningful values)
    * @dev Note that answer and updatedAt may change between queries.
    */
    function latestRoundData()
        public
        view
        virtual
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        Phase memory current = currentFeed; // cache storage reads
        return current.porFeed.latestRoundData();
    }

    /**
    * @notice represents the number of decimals the aggregator responses represent.
    */
    function decimals()
        external
        view
        returns (uint8)
    {
        return currentFeed.porFeed.decimals();
    }

    /**
    * @notice the version number representing the type of aggregator the proxy
    * points to.
    */
    function version()
        external
        view
        returns (uint256)
    {
        return currentFeed.porFeed.version();
    }

    /**
    * @notice returns the description of the aggregator the proxy points to.
    */
    function description()
        external
        view
        returns (string memory)
    {
        return currentFeed.porFeed.description();
    }
}

