import React, { FC } from 'react';
import { Container, Header, SpaceBetween } from '@cloudscape-design/components';
import './index.css';
import { useSelector } from 'react-redux';
import { DashboardState } from '../../store/state';
import { DashboardMessages } from '../../messages';
import { AppKitComponentTags } from '../../types';
import TextSettings from './sections/textSettingSection/text';
import LinkSettings from './sections/textSettingSection/link';
import { BaseSettings } from './sections/baseSettingSection';
import ThresholdsSection from './sections/thresholdsSection/thresholdsSection';
import PropertiesAlarmsSection from './sections/propertiesAlarmSection';

const SidePanel: FC<{ messageOverrides: DashboardMessages }> = ({ messageOverrides }) => {
  const selectedWidgets = useSelector((state: DashboardState) => state.selectedWidgets);
  if (selectedWidgets.length !== 1) {
    return <div>Currently we only support changing setting for one widget only.</div>;
  }

  const selectedWidget = selectedWidgets[0];
  const isAppKitWidget = AppKitComponentTags.find((tag) => tag === selectedWidget.componentTag);
  const isTextWidget = selectedWidget.componentTag === 'text';

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
    </Container>
  );
};

export default SidePanel;
