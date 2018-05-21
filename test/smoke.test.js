import { hterm, lib } from '..';

describe('hterm-umdjs', () => {
  it('should work', () => {
    hterm.defaultStorage = new lib.Storage.Memory();
    const term = new hterm.Terminal();
    term.io.println('hterm-umdjs');
  });
});
