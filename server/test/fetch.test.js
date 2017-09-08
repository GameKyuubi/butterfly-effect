const AirspaceChecker = require('../lib/AirspaceChecker');
const FakeAirspaceChecker = require('../lib/FakeAirspaceChecker');
const assert = require('chai').assert;

describe('AirspaceChecker', () => {
  xit('should not fly in bad zones', async () => {
    const origin = [35.5487166, 139.7690696];
    const dest = [35.4998496, 139.8700009];
    const result = await AirspaceChecker.checkSpace(origin, dest);
    assert(result === false, 'drone should not be allowed to fly here');
  });

  xit('should fly in good zones', async () => {
    const origin = [35.6668205, 139.7132626];
    const dest = [35.6668205, 139.7131468];
    const result = await AirspaceChecker.checkSpace(origin, dest);
    assert(result === true, 'drone should be allow to fly here');
  });
});

describe('FakeAirspaceChecker', () => {
  it('should not fly in bad zones', async () => {
    const origin = [35.530596, 139.7401493];
    const dest = [35.596948, 139.8143323];
    const result = await FakeAirspaceChecker.checkSpace(origin, dest);
    assert(result === false, 'it is not ok to fly here');
  });

  it('should fly in good zones', async () => {
    const origin = [35.6668205, 139.7132626];
    const dest = [35.6668205, 139.7131468];
    const result = await FakeAirspaceChecker.checkSpace(origin, dest);
    assert(result === true, 'it is ok to fly here');
  });
});
