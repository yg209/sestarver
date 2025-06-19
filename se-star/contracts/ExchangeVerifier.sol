
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExchangeVerifier {
    enum VerificationLevel {Red, Gray, Silver, Gold, Diamond}
    mapping(address => VerificationLevel) public verifiedExchanges;

    function verifyExchange(address exchange, VerificationLevel level) external {
        verifiedExchanges[exchange] = level;
    }
}
