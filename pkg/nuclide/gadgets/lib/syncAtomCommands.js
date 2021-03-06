'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import createAtomCommands from './createAtomCommands';
import type Immutable from 'immutable';
import type Rx from 'rx';

/**
 * Keep the Atom commands in sync with the application state. If the returned subscription is
 * disposed, the Atom commands will be removed.
 */
export default function syncAtomCommands(
  gadget$: Rx.Observable<Immutable.Map>,
  appCommands: Object,
): IDisposable {
  let atomCommands: ?IDisposable;

  return gadget$
    .debounce(500)
    .distinctUntilChanged()
    .forEach(gadgets => {
      // Add Atom commands idempotently...
      // Dispose of the previous commands.
      if (atomCommands != null) {
        atomCommands.dispose();
      }
      // Add new ones.
      if (gadgets && gadgets.size > 0) {
        atomCommands = createAtomCommands(gadgets, appCommands);
      }
    });
}
