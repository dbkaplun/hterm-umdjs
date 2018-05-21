import { hterm, lib } from 'hterm-umdjs';

describe('hterm-umdjs', () => {
  it('should work', () => {
    hterm.defaultStorage = new lib.Storage.Memory();
    var term = new hterm.Terminal();
  });
});
