import React from 'react';
import { useSelector } from 'react-redux';

import { StatusGrid } from '@iot-app-kit/react-components';
import { useDataSource } from '../../hooks/useDataSource';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { Annotations, YAnnotation } from '@synchro-charts/core';
import type { DashboardState } from '~/store/state';
import type { StatusWidget } from '../types';

const StatusWidgetComponent: React.FC<StatusWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);

  const { queryConfig, styleSettings, thresholdSettings } = widget.properties;

  const { dataSource } = useDataSource();
  const queries = dataSource.query && queryConfig.query ? [dataSource.query?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);

  const annotations: Annotations = {
    y: thresholdSettings?.thresholds?.map(
      (t) =>
        ({
          id: t.id,
          comparisonOperator: t.comparisonOperator,
          color: t.color,
          value: t.comparisonValue,
        } as YAnnotation)
    ),
    colorDataAcrossThresholds: thresholdSettings?.colorAcrossThresholds,
  };

  return (
    <StatusGrid
      key={key}
      queries={queries}
      viewport={viewport}
      styleSettings={styleSettings}
      annotations={annotations}
    />
  );
};

export default StatusWidgetComponent;
