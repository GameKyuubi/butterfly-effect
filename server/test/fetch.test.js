require('dotenv').config();
const AirspaceChecker = require('../lib/AirspaceChecker');
const assert = require('chai').assert;

describe('AirspaceChecker', () => {
  it('should not fly in bad zones', async () => {
    const origin = [35.5487166, 139.7690696];
    const dest = [35.4998496, 139.8700009];
    const result = await AirspaceChecker.checkSpace(origin, dest);
    assert(result === false, 'drone should not be allowed to fly here');
  });

  it('should fly in good zones', async () => {
    const origin = [36.016789, 138.2744983];
    const dest = [36.030399, 138.3148293];
    const result = await AirspaceChecker.checkSpace(origin, dest);
    assert(result === true, 'drone should be allow to fly here');
  });
});
