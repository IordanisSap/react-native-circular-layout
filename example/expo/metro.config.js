const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'), // node_modules inside example/expo
  path.resolve(__dirname, '../../node_modules'), // node_modules at the root of react-native-circular-layout
];

defaultConfig.watchFolders = [
  path.resolve(__dirname, '../..'), // Watch the root of react-native-circular-layout
];

defaultConfig.resolver.disableHierarchicalLookup = true;

module.exports = defaultConfig;