// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface IMyShell {
  /// Event emitted when the blacklist is updated
  /// @param account The account that has had it's blacklist record updated
  /// @param isBlacklisted True or false, indicating the status of this users blacklist
  event BlacklistUpdated(address indexed account, bool isBlacklisted);

  /// A function that allows callers with the address account to be able to bulk update blacklist status'
  /// @param accounts The accounts to have their blacklist status updated
  /// @param statuses An array with the same indexes as the accounts array with status' to write
  /// @dev accounts and statuses arrays must be the same length
  /// @notice If an account is blacklisted, they cannot be transferred to or initiate transfers
  /// @notice only callable by accounts with the BLACKLISTER_ROLE
  function bulkBlacklistUpdate(
    address[] calldata accounts,
    bool[] calldata statuses
  ) external;

  /// A function that allows callers with the BLACKLISTER_ROLE to blacklist an address
  /// @param account The address to be blacklisted
  /// @notice If an account is blacklisted, they cannot be transferred to or initiate transfers
  /// @notice only callable by accounts with the BLACKLISTER_ROLE
  function blacklist(address account) external;

  /// A function that allows callers with the BLACKLISTER_ROLE to unblacklist an address
  /// @param account The address to be unblacklisted
  /// @notice only callable by accounts with the BLACKLISTER_ROLE
  function unblacklist(address account) external;

  /// A view function that returns the blacklist status of a given address
  /// @param account The address thats blacklist status is being queried
  /// @return bool true or false, true for blacklisted account, false otherwise
  function isBlackListed(address account) external view returns (bool);
}
