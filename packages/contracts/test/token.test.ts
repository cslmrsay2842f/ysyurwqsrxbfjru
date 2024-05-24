import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { parseEther } from "viem";

import { MyShell } from "../typechain-types";

export const AccessControlError = (role: string, address: string) =>
  `VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${address.toLowerCase()} is missing role ${role}'`;

describe("MyShell token tests", () => {
  let Deployer: SignerWithAddress;
  let Alice: SignerWithAddress;

  let ToBlackListUser1: SignerWithAddress;
  let ToBlackListUser2: SignerWithAddress;

  let myShell: MyShell;
  let signers: SignerWithAddress[];

  beforeEach(async () => {
    await deployments.fixture("testbed");
    signers = await ethers.getSigners();

    [Deployer, Alice, ToBlackListUser1, ToBlackListUser2] = signers;

    myShell = (await ethers.getContract("MyShell", Deployer)) as MyShell;

    // grant the blacklisting role to our deployer for our tests
    await myShell.grantRole(await myShell.BLACKLISTER_ROLE(), Deployer.address);
  });

  it("Should not let an unpermissioned user call the blacklist function", async () => {
    // tx will revert
    await expect(
      myShell.connect(Alice).blacklist(ToBlackListUser1.address)
    ).to.be.rejectedWith(
      AccessControlError(await myShell.BLACKLISTER_ROLE(), Alice.address)
    );
  });

  it("Should not let an unpermissioned user call the unblacklist function", async () => {
    // tx will revert
    await expect(
      myShell.connect(Alice).unblacklist(ToBlackListUser1.address)
    ).to.be.rejectedWith(
      AccessControlError(await myShell.BLACKLISTER_ROLE(), Alice.address)
    );
  });

  it("Should not let an unpermissioned user call the bulkBlacklistUpdate function", async () => {
    await expect(
      myShell
        .connect(Alice)
        .bulkBlacklistUpdate(
          [ToBlackListUser1.address, ToBlackListUser2.address],
          [false, true]
        )
    ).to.be.rejectedWith(
      AccessControlError(await myShell.BLACKLISTER_ROLE(), Alice.address)
    );
  });

  it("Should let an admin blacklist and unblacklist", async () => {
    // blacklist the ToBlackListUser1
    await myShell.blacklist(ToBlackListUser1.address);
    expect(await myShell.isBlackListed(ToBlackListUser1.address)).to.equal(
      true
    );

    // now unblacklist
    await myShell.unblacklist(ToBlackListUser1.address);
    expect(await myShell.isBlackListed(ToBlackListUser1.address)).to.equal(
      false
    );
  });

  it("Should let an bulk update the blacklist", async () => {
    // blacklist the ToBlackListUser1
    await myShell.blacklist(ToBlackListUser1.address);
    expect(await myShell.isBlackListed(ToBlackListUser1.address)).to.equal(
      true
    );
    expect(await myShell.isBlackListed(ToBlackListUser2.address)).to.equal(
      false
    );

    // in our bulk blacklist update, we will unblacklist ToBlackListUser1 and blacklist ToBlackListUser2
    await myShell.bulkBlacklistUpdate(
      [ToBlackListUser1.address, ToBlackListUser2.address],
      [false, true]
    );

    expect(await myShell.isBlackListed(ToBlackListUser1.address)).to.equal(
      false
    );
    expect(await myShell.isBlackListed(ToBlackListUser2.address)).to.equal(
      true
    );
  });

  it("Should not let a user transfer once they have been blacklisted", async () => {
    expect(await myShell.isBlackListed(ToBlackListUser1.address)).to.equal(
      false
    );

    const amountToTransfer = parseEther("420");

    // fund ToBlackListUser1 with some tokens from the deployer
    await myShell
      .connect(Deployer)
      .transfer(ToBlackListUser1.address, amountToTransfer);

    expect(await myShell.balanceOf(ToBlackListUser1.address)).to.equal(
      amountToTransfer
    );

    const secondTransferAmount = parseEther("69");

    // Should be able to transfer (not blacklisted yet)
    await myShell
      .connect(ToBlackListUser1)
      .transfer(ToBlackListUser2.address, secondTransferAmount);

    // balance Should have updated
    expect(await myShell.balanceOf(ToBlackListUser1.address)).to.equal(
      amountToTransfer - secondTransferAmount
    );

    // and user is not blacklisted
    expect(await myShell.isBlackListed(ToBlackListUser1.address)).to.equal(
      false
    );

    // now blacklist the user
    await myShell.blacklist(ToBlackListUser1.address);

    // now if we try to transfer as blacklisted user the the tx will revert
    await expect(
      myShell.connect(ToBlackListUser1).transfer(ToBlackListUser2.address, 1)
    ).to.be.rejectedWith("blacklisted");

    // and balance won't have changed
    expect(await myShell.balanceOf(ToBlackListUser1.address)).to.equal(
      amountToTransfer - secondTransferAmount
    );

    // and if we try to transfer to the blacklisted user, the tx will revert
    await expect(
      myShell.connect(ToBlackListUser2).transfer(ToBlackListUser1.address, 1)
    ).to.be.rejectedWith("blacklisted");

    // balance won't have changed
    expect(await myShell.balanceOf(ToBlackListUser2.address)).to.equal(
      secondTransferAmount
    );
  });
});
