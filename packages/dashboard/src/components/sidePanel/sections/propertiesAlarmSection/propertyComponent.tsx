import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { DashboardState } from '../../../../store/state';
import { useInput } from '../../utils';
import { StyleSettingsMap } from '@iot-app-kit/core';
import { Grid, Icon, SpaceBetween } from '@cloudscape-design/components';
import { DashboardMessages } from '../../../../messages';
import ColorPicker from '../../shared/colorPicker';

export type PropertyComponentProps = {
  assetId: string;
  propertyId: string;
  refId: string;
  onDeleteAssetQuery: () => void;
  messageOverrides: DashboardMessages;
};

export const PropertyComponent: FC<PropertyComponentProps> = ({
  assetId,
  propertyId,
  refId,
  onDeleteAssetQuery,
  messageOverrides: {
    sidePanel: {
      propertySection: { propertyComponent },
    },
  },
}) => {
  const assetDescription = useSelector((state: DashboardState) => state.assetsDescriptionMap)?.[assetId];
  const assetProperties = assetDescription?.assetProperties;
  const assetProperty = assetProperties?.find((prop) => prop.id === propertyId);
  const defaultName =
    assetProperty?.name && assetDescription?.assetName && `${assetProperty?.name} (${assetDescription?.assetName})`;
  const label = defaultName || propertyId;
  const [styleSettings = {}, updateStyleSettings] = useInput<StyleSettingsMap>(`styleSettings`);
  const color = styleSettings[refId]?.color;
  const { dataType, unit, alias } = assetProperty || {};
  const updatePropertyColor = (color: string) =>
    updateStyleSettings({
      ...styleSettings,
      [refId]: {
        ...styleSettings[refId],
        color,
      },
    });

  return (
    <Grid gridDefinition={[{ colspan: 12 }]}>
      <SpaceBetween size="xxxs" direction={'vertical'}>
        <Grid gridDefinition={[{ colspan: 0 }, { colspan: 7 }, { colspan: 3 }]}>
          <div className="threshold-content-item with-gutter grow">
            <ColorPicker color={color || ''} updateColor={() => updatePropertyColor} />
          </div>

          <div className="threshold-content-item with-gutter grow">
            <span>{label}</span>
          </div>
          <div className="threshold-content-item with-gutter grow">
            <div onClick={onDeleteAssetQuery} className="justify-content-end">
              <Icon name={'close'} />
            </div>
          </div>
        </Grid>

        <SpaceBetween size={'xs'} direction={'horizontal'}>
          {alias && <small>Alias: {alias}</small>}
          {dataType && (
            <small>
              {propertyComponent.dataType}: {dataType}
            </small>
          )}
          {unit && (
            <small>
              {propertyComponent.unit}: {unit}
            </small>
          )}
        </SpaceBetween>
      </SpaceBetween>
    </Grid>
  );
};
