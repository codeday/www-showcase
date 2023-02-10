// for some unknown reason, jest refuses to acknowledge the existence of .babelrc and will only work if this file exists
// the config here is only relevant to when running in jest, when running normally .babelrc takes priority
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: ['import-graphql'],
};
