interface rulesSer {
  key: number;
  value: string;
}

const myMap = new Map<number, string>();

const addRule = (rule: rulesSer): void => {
  myMap.set(rule.key, rule.value);
};

addRule({
  key: 1,
  value:
    "To be eligible for the airdrop, you must have a valid Web3-compatible wallet. Tokens cannot be claimed by exchange wallets. Ensure you provide accurate wallet addresses.",
});
addRule({
  key: 2,
  value:
    "All participants must have registered via our designated form before the cut-off date. Late registrations will not be eligible for the token airdrop.",
});
addRule({
  key: 3,
  value:
    "Participants must successfully complete our KYC (Know Your Customer) process. This requirement ensures compliance with international regulations and prevents fraud.",
});
addRule({
  key: 4,
  value:
    "Claimed tokens will be distributed within 30 days from the end of the airdrop. The distribution date will be announced on our official social media channels.",
});
addRule({
  key: 5,
  value:
    "The number of tokens to be airdropped is limited. They will be allocated on a first-come, first-served basis, as long as the supply lasts.",
});
addRule({
  key: 6,
  value:
    "Unclaimed tokens after the specified claim duration will be redistributed or burned based on the project’s token economic model. To avoid losing your tokens, claim them as soon as possible.",
});
addRule({
  key: 7,
  value:
    "Each eligible wallet can only claim once. Any attempt to claim multiple times from different accounts will result in the forfeiture of your token eligibility.",
});
addRule({
  key: 8,
  value:
    "By participating in the token airdrop, you agree to the terms and conditions set by our platform. Always stay updated with our regulations by checking our official channels. \n Remember, a safe and fair airdrop process relies on your compliance to these rules. Let’s create a vibrant Web3 community together.",
});

const Rules = () => ({
  addRule,
  getMap: () => myMap,
});

export { Rules };
