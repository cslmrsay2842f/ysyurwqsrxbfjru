// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IAirdrop {
  /// The function that is called by users to claim their MyShell tokens
  /// @param _account The public key of the recipient
  /// @param _amount The amount of tokens that this user is claiming
  /// @param _proof The merkle proof of this users _account and _amount variables as a leaf within the contracts `root` variable merkle tree
  function redeem(
    address _account,
    uint256 _amount,
    bytes32[] calldata _proof
  ) external;

  /// Allows for updating of the unlock time of the Airdrop to be changed
  /// @param _timestamp The new timestamp to set the Airdrop available at
  /// @notice Only callable by accounts with the DEFAULT_ADMIN_ROLE role
  function setUnlockTime(uint256 _timestamp) external;

  /// Allows for withdrawal of the excess tokens after the claim period of this contract has ended
  function withdrawLeftoverMyShell() external;

  /// Allows for updating of the contracts merkle root
  /// @param _root The new root of the merkle tree
  /// @notice Only callable by accounts with the DEFAULT_ADMIN_ROLE role
  function setRoot(bytes32 _root) external;

  /// Event emitted when the airdrop unlock time is updated
  /// @param unlockTime The new unlock time
  event UnlockTimeUpdated(uint256 indexed unlockTime);

  /// Event emitted when the leftover MyShell tokens are withdrawn
  /// @param recipient The address that is sent the leftover MyShell tokens
  /// @param amount The amount of tokens they're sent
  /// @notice Only callable by accounts with the DEFAULT_ADMIN_ROLE role
  event LeftoverMyShellWithdrawn(address recipient, uint256 amount);

  /// Event emitted when the merkle root of the contract is updated
  /// @param newRoot The new merkle root
  event MerkleRootUpdated(bytes32 indexed newRoot);
}
