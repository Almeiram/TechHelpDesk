import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it('should be defined', () => {
    // Provide a minimal mock for Reflector
    const reflectorMock = { get: () => undefined } as any;
    expect(new RolesGuard(reflectorMock)).toBeDefined();
  });
});
