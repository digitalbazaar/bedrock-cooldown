/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import bedrock from 'bedrock';
const {config} = bedrock;

const cfg = config['cooldown'] = {};

cfg.alert = {
  ttl: 15 * 1000 // 15 seconds
};

cfg.monitor = {
  interval: 10 * 1000
};
