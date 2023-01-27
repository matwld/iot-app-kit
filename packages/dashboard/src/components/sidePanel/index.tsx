import React, { FC } from 'react';
import { Button, Container, Header, SpaceBetween } from '@cloudscape-design/components';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardState } from '../../store/state';
import { DashboardMessages } from '../../messages';
import { AppKitComponentTags, AppKitWidget } from '../../types';
import TextSettings from './sections/textSettingSection/text';
import LinkSettings from './sections/textSettingSection/link';
import { BaseSettings } from './sections/baseSettingSection';
import ThresholdsSection from './sections/thresholdsSection/thresholdsSection';
import PropertiesAlarmsSection from './sections/propertiesAlarmSection';
import { onUpdateAssetQueryAction } from '../../store/actions/updateAssetQuery';

const SidePanel: FC<{ messageOverrides: DashboardMessages }> = ({ messageOverrides }) => {
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  if (selectedWidgets.length !== 1) {
    return <div>Currently we only support changing setting for one widget only.</div>;
  }

  const selectedWidget = selectedWidgets[0];
  const isAppKitWidget = AppKitComponentTags.find((tag) => tag === selectedWidget.componentTag);
  const isTextWidget = selectedWidget.componentTag === 'text';
  const dispatch = useDispatch();
  return (
    <Container header={<Header variant="h3">Configurations</Header>} className={'iot-side-panel'}>
      <SpaceBetween size={'xs'} direction={'vertical'}>
        <BaseSettings messageOverrides={messageOverrides} />
        {isTextWidget && <TextSettings messageOverride={messageOverrides} />}
        {isTextWidget && <LinkSettings messageOverride={messageOverrides} />}
        {isAppKitWidget && (
          <>
            <PropertiesAlarmsSection messageOverrides={messageOverrides} />
            <ThresholdsSection messageOverrides={messageOverrides} />
            {/*<DataSettings />*/}
          </>
        )}
      </SpaceBetween>
      <br />
      <Button
        onClick={() => {
          dispatch(
            onUpdateAssetQueryAction({
              widget: selectedWidgets[0] as AppKitWidget,
              assetQuery: [
                {
                  assetId: '8f74f96e-325e-43c5-99c3-b2a88fd89a6c',
                  properties: [{ propertyId: '40e120a0-bc64-4f6d-8a63-10abdd2be490' }],
                },
              ],
            })
          );
        }}
      >
        Add RPM property to widget
      </Button>
    </Container>
  );
};

export default SidePanel;
