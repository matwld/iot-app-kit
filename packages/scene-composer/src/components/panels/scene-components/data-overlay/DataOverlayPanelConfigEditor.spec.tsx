import React from 'react';
import { act, render } from '@testing-library/react';
import wrapper from '@cloudscape-design/components/test-utils/dom';

import { DataOverlayPanelConfigEditor } from './DataOverlayPanelConfigEditor';

jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

describe('DataOverlayPanelConfigEditor', () => {
  const config = {
    isPinned: true,
  };
  const onUpdateCallbackMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update when clicking checkbox', async () => {
    const { container } = render(
      <DataOverlayPanelConfigEditor config={config} onUpdateCallback={onUpdateCallbackMock} />,
    );
    const polarisWrapper = wrapper(container);

    const pinnedCheckbox = polarisWrapper.findCheckbox('[data-testid="pinned-checkbox"]');
    expect(pinnedCheckbox).not.toBeNull();

    act(() => {
      pinnedCheckbox!.findNativeInput().click();
    });

    expect(onUpdateCallbackMock).toBeCalledTimes(1);
    expect(onUpdateCallbackMock).toBeCalledWith(
      {
        config: { isPinned: false },
      },
      false,
    );
  });
});
