/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import bedrock from 'bedrock';
import LRU from 'lru-cache';

require('./config');

const {config} = bedrock;
const cfg = config['cooldown'];

const DEFAULT_TTL = cfg.alert.ttl;
const COOLDOWN_CACHE = new LRU({maxAge: DEFAULT_TTL});

function isActive({key} = {}) {
  if(!key) {
    return size() > 0;
  }
  COOLDOWN_CACHE.prune();
  return !!COOLDOWN_CACHE.keys().find(k => k === key);
}

function size() {
  COOLDOWN_CACHE.prune();
  return COOLDOWN_CACHE.length;
}

function set(id, value, maxAge) {
  return COOLDOWN_CACHE.set(id, {...value, timestamp: new Date()}, maxAge);
}

bedrock.events.on('bedrock.start', () => {
  _startReportCollection();
});

function _startReportCollection() {
  setInterval(async () => {
    await bedrock.events.emit('bedrock-cooldown.report', {addAlert: set});
  }, cfg.monitor.interval);
}

export {isActive, set, size};
