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
  const keys = Array.isArray(key) ? key : [key];

  for(const key of keys) {
    // do not use the lru-cache `get()` API as that will updated the
    // "recently used"-ness of the key.
    const found = get(key);
    if(found) {
      return true;
    }
  }

  return false;
}

function size() {
  const values = [];
  COOLDOWN_CACHE.forEach(v => {
    values.push(v);
  });
  COOLDOWN_CACHE.prune();
  return COOLDOWN_CACHE.length;
}

function get(key) {
  let found;
  COOLDOWN_CACHE.forEach((v, k) => {
    if(!found && key === k) {
      found = v;
    }
  });
  return found;
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

export {isActive, get, set, size};
