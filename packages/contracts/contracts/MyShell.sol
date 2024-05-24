// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./IMyShell.sol";

contract MyShell is IMyShell, ERC20, ERC20Permit, AccessControl {
  /////////////////////
  /// Contract Storage
  /////////////////////

  /// the max supply of the myshell token, all minted in the constructor
  uint256 public immutable MAX_SUPPLY = 1_000_000_000 * 10 ** 18; // 1 billion total tokens

  /// role given to accounts with the ability to blacklist (block transfers to/from addresses),
  /// as well as unblacklist
  bytes32 public constant BLACKLISTER_ROLE = keccak256("BLACKLISTER_ROLE");

  /// mapping that tracks blacklisted users
  mapping(address user => bool isBlacklisted) private blacklistedUsers;

  /////////////////////
  /// Constructor
  /////////////////////
  /// @param myshellTreasury The address where the MyShell tokens are sent
  constructor(
    address myshellTreasury
  ) ERC20("MyShell", "SHELL") ERC20Permit("MyShell") {
    _grantRole(DEFAULT_ADMIN_ROLE, myshellTreasury);
    _mint(myshellTreasury, MAX_SUPPLY);
  }

  /////////////////////
  /// Blacklist Methods
  /////////////////////

  /// @inheritdoc IMyShell
  function bulkBlacklistUpdate(
    address[] calldata accounts,
    bool[] calldata statuses
  ) external onlyRole(BLACKLISTER_ROLE) {
    require(
      accounts.length == statuses.length,
      "myshell: malformed bulkBlacklist call"
    );
    for (uint256 i; i < accounts.length; i++) {
      emit BlacklistUpdated(accounts[i], statuses[i]);
      blacklistedUsers[accounts[i]] = statuses[i];
    }
  }

  /// @inheritdoc IMyShell
  function blacklist(address account) external onlyRole(BLACKLISTER_ROLE) {
    emit BlacklistUpdated(account, true);
    blacklistedUsers[account] = true;
  }

  /// @inheritdoc IMyShell
  function unblacklist(address account) external onlyRole(BLACKLISTER_ROLE) {
    emit BlacklistUpdated(account, false);
    blacklistedUsers[account] = false;
  }

  /// @inheritdoc IMyShell
  function isBlackListed(address account) external view returns (bool) {
    return blacklistedUsers[account];
  }

  /// Overriding the _beforeTokenTransfer to check whether or not the sending or receiving
  /// acount address is blacklisted, and reverting if so.
  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override {
    require(!blacklistedUsers[from], "MyShell: sender is blacklisted");
    require(!blacklistedUsers[to], "MyShell: recipient is blacklisted");
    super._beforeTokenTransfer(from, to, amount);
  }
}
