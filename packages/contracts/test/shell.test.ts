import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { keccak256, parseEther } from "ethers/lib/utils";
import { deployments, ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";

import { hashLeaf } from "../helpers";
import { Airdrop, MyShell } from "../typechain-types";

describe("MyShell airdrop claim", () => {
  let Deployer: SignerWithAddress;

  let merkleTree: MerkleTree;
  let leafs: Buffer[];

  let myShell: MyShell;
  let airdrop: Airdrop;

  let signers: SignerWithAddress[];

  const claimAmount = parseEther("100");

  beforeEach(async () => {
    await deployments.fixture("testbed");
    signers = await ethers.getSigners();

    [Deployer] = signers;

    leafs = signers.map((signer) => hashLeaf(claimAmount, signer.address));

    merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
    myShell = (await ethers.getContract("MyShell", Deployer)) as MyShell;

    const airdropFactory = await ethers.getContractFactory("Airdrop");

    const tx = await airdropFactory.deploy(
      `0x${merkleTree.getRoot().toString("hex")}`,
      myShell.address,
      Deployer.address
    );

    airdrop = await ethers.getContractAt("Airdrop", tx.address);

    await myShell.connect(Deployer).transfer(tx.address, parseEther("500"));

    const blockTime = (await ethers.provider.getBlock("latest")).timestamp;
    await airdrop.setUnlockTime(blockTime);
  });

  it("Should show a leaf as claimed", async () => {
    const proof = merkleTree.getHexProof(leafs[0]);

    await airdrop
      .connect(Deployer)
      .redeem(Deployer.address, claimAmount, proof);

    const test = leafs[0];

    const isUsed = await airdrop.usedClaims(test);

    expect(isUsed).to.be.equal(true);
  });

  it("Should not allow claiming before the unlock time", async () => {
    // generate a users proof
    const proof = merkleTree.getHexProof(leafs[0]);

    const balanceBefore = await myShell.balanceOf(Deployer.address);

    // update the unlock time to far in the future
    await airdrop.setUnlockTime(
      (await ethers.provider.getBlock("latest")).timestamp + 10000000
    );

    await expect(
      airdrop.connect(Deployer).redeem(Deployer.address, claimAmount, proof)
    ).to.be.rejectedWith("Airdrop: myshellTokens are locked");

    const balanceAfter = await myShell.balanceOf(Deployer.address);

    expect(balanceAfter).to.be.eq(balanceBefore);
  });

  it("Should work for valid merkle root", async () => {
    // generate a users proof
    const proof = merkleTree.getHexProof(leafs[0]);

    const balanceBefore = await myShell.balanceOf(Deployer.address);
    await airdrop
      .connect(Deployer)
      .redeem(Deployer.address, claimAmount, proof);

    const balanceAfter = await myShell.balanceOf(Deployer.address);

    expect(balanceAfter.sub(balanceBefore)).to.be.eq(claimAmount);
  });

  it("Should fail for invalid merkle root (invalid amount)", async () => {
    const proof = merkleTree.getHexProof(leafs[0]);

    const invalidClaimAmount = parseEther("200000");

    const balanceBefore = await myShell.balanceOf(Deployer.address);
    await expect(
      airdrop
        .connect(Deployer)
        .redeem(Deployer.address, invalidClaimAmount, proof)
    ).to.be.revertedWith("Airdrop: Invalid merkle proof");

    const balanceAfter = await myShell.balanceOf(Deployer.address);

    expect(balanceAfter).to.be.eq(balanceBefore);
  });

  it("Should fail for invalid merkle root (invalid address)", async () => {
    const proof = merkleTree.getHexProof(leafs[0]);

    const invalidAddressClaimer = signers[8].address;

    const balanceBefore = await myShell.balanceOf(Deployer.address);

    await expect(
      airdrop
        .connect(Deployer)
        .redeem(invalidAddressClaimer, claimAmount, proof)
    ).to.be.revertedWith("Airdrop: Invalid merkle proof");

    const balanceAfter = await myShell.balanceOf(Deployer.address);

    expect(balanceAfter).to.be.eq(balanceBefore);
  });

  it("shouldn't allow for claiming twice", async () => {
    const proof = merkleTree.getHexProof(leafs[0]);

    const balanceBefore = await myShell.balanceOf(Deployer.address);

    await airdrop
      .connect(Deployer)
      .redeem(Deployer.address, claimAmount, proof);

    const balanceAfter = await myShell.balanceOf(Deployer.address);

    expect(balanceAfter.sub(balanceBefore)).to.be.eq(claimAmount);

    await expect(
      airdrop.connect(Deployer).redeem(Deployer.address, claimAmount, proof)
    ).to.be.revertedWith("Airdrop: Claim has already been used");
  });
});
