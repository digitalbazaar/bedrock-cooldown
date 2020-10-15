/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import bedrock from 'bedrock';
const {config} = bedrock;

const cfg = config['cooldown'] = {};

cfg.report = {
  ttl: 10 * 1000 // 10 seconds
};
