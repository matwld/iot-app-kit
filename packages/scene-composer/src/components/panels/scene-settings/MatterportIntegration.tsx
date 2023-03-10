import React, { useContext, useEffect, useState } from 'react';
import { Box, FormField, Select, SpaceBetween } from '@awsui/components-react';
import { defineMessages, useIntl } from 'react-intl';

import useLifecycleLogging from '../../../logger/react-logger/hooks/useLifecycleLogging';
import { useStore } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { KnownSceneProperty } from '../../../interfaces';
import { pascalCase } from '../../../utils/stringUtils';
import { getGlobalSettings, subscribe, unsubscribe } from '../../../common/GlobalSettings';

export const MatterportIntegration: React.FC = () => {
  const log = useLifecycleLogging('SettingsPanel');
  const sceneComposerId = useContext(sceneComposerIdContext);
  const getSceneProperty = useStore(sceneComposerId)((state) => state.getSceneProperty);
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);
  const intl = useIntl();

  const get3pConnectionListFunction = getGlobalSettings().get3pConnectionListFunction;

  log?.verbose('Initialize Matterport Integration');

  const selectedEnvPreset = () => {
    return getSceneProperty(KnownSceneProperty.EnvironmentPreset);
  };

  log?.verbose('Selected environment preset', selectedEnvPreset());

  const i18nPresetsStrings = defineMessages({
    'No Preset': {
      defaultMessage: 'No Preset',
      description: 'Environment presets drop down menu options',
    },
    neutral: {
      defaultMessage: 'Neutral',
      description: 'Environment presets drop down menu options',
    },
    directional: {
      defaultMessage: 'Directional',
      description: 'Environment presets drop down menu options',
    },
    chromatic: {
      defaultMessage: 'Chromatic',
      description: 'Environment presets drop down menu options',
    },
  });

  const selectedOption = selectedEnvPreset()
    ? {
        label: intl.formatMessage(i18nPresetsStrings[selectedEnvPreset()]) || pascalCase(selectedEnvPreset()),
        value: selectedEnvPreset,
      }
    : null;

  const [connectionOptions, setConnectionOptions] = useState<{ label: string; value: string }[]>([]);

  const getConnectionList = async () => {
    const connectionList: { label: string; value: string }[] = [];
    if (get3pConnectionListFunction) {
      const response = await get3pConnectionListFunction('AWSIoTTwinMaker_Matterport');
      if (response) {
        response.forEach((secret) => {
          if (secret.Name && secret.ARN) {
            connectionList.push({ label: secret.Name, value: secret.ARN });
          }
        });
      }
    }
    setConnectionOptions(connectionList);
  };

  const onUpdated = () => {
    getConnectionList();
  };

  useEffect(() => {
    subscribe(onUpdated);

    return () => unsubscribe(onUpdated);
  }, []);

  return (
    <React.Fragment>
      <SpaceBetween size='s'>
        <Box fontWeight='bold'>
          {intl.formatMessage({ description: 'Sub-Section Header', defaultMessage: 'Matterport Integration' })}
        </Box>
        <Box>
          {intl.formatMessage({
            description: 'Sub-Section Description',
            defaultMessage: 'Connecting your Matterport account enables viewing spaces in your TwinMaker scene. ',
          })}
        </Box>
        {get3pConnectionListFunction && (
          <FormField label={intl.formatMessage({ description: 'Form Field label', defaultMessage: 'Connection Name' })}>
            <Select
              selectedOption={null}
              onChange={(e) => {
                if (e.detail.selectedOption.value === 'n/a') {
                  setSceneProperty(KnownSceneProperty.EnvironmentPreset, undefined);
                } else {
                  setSceneProperty(KnownSceneProperty.EnvironmentPreset, e.detail.selectedOption.value);
                }
              }}
              options={connectionOptions}
              selectedAriaLabel={intl.formatMessage({ defaultMessage: 'Selected', description: 'label' })}
              disabled={false} //{connectionOptions.length === 0}
              placeholder={intl.formatMessage({
                defaultMessage: 'Choose a connection',
                description: 'choose a connection placeholder',
              })}
              expandToViewport
            />
          </FormField>
        )}
      </SpaceBetween>
    </React.Fragment>
  );
};
