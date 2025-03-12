// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Test {
    string public message = "Hello, Monad!";
    
    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}