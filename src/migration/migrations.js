// Array of migration tasks (assuming we will only ever need a single path migration,
// for complex migration paths we would need a graph structure)
module.exports = [
  {
    task: require('./migration_testnet_to_1_0_0.js'),
    from: '0.0.0',
  },

  {
    task: require('./migration_1_0_0_to_1_0_1.js'),
    from: '1.0.0',
  },

  {
    task: require('./migration_1_0_1_to_1_0_2.js'),
    from: '1.0.1',
  }
]
