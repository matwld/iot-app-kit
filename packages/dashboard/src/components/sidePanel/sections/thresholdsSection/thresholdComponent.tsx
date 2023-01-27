import { COMPARISON_OPERATOR, ThresholdValue } from '@synchro-charts/core';
import React, { FC, useEffect, useState } from 'react';
import { DashboardMessages } from '../../../../messages';
import { useInput } from '../../utils';
import { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import {
  Button,
  Grid,
  Input,
  InputProps,
  Select,
  SelectProps,
  TokenGroup,
  TokenGroupProps,
} from '@cloudscape-design/components';
import ColorPicker from '../../shared/colorPicker';
import { DEFAULT_THRESHOLD_COLOR, OPS_ALLOWED_WITH_STRING } from './defaultValues';
import { AppKitComponentTag } from '../../../../types';
import './index.scss';

const widgetsSupportsContainOp: AppKitComponentTag[] = [
  'iot-kpi',
  'iot-status-grid',
  'iot-status-timeline',
  'iot-table',
];

const ThresholdListInput: FC<{ onEnter: (value: ThresholdValue) => void }> = ({ onEnter }) => {
  const [value, updateValue] = useState<string>('');
  const onChange: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail: { value } }) => {
    updateValue(value);
  };

  const onKeyDown: NonCancelableEventHandler<InputProps.KeyDetail> = ({ detail: { key } }) => {
    if (key === 'Enter') {
      onEnter(value);
      updateValue('');
    }
  };
  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder="Threshold value"
      data-test-id="threshold-component-value-input"
      onKeyDown={onKeyDown}
    />
  );
};

export const ThresholdComponent: FC<{ path: string; deleteSelf: () => void; messageOverrides: DashboardMessages }> = ({
  path,
  deleteSelf,
  messageOverrides: {
    sidePanel: { thresholdSettings },
  },
}) => {
  const [color = DEFAULT_THRESHOLD_COLOR, updateThresholdColor] = useInput<string>(path + '.color');
  const [comparisonOperator, updateComparator] = useInput<COMPARISON_OPERATOR>(path + '.comparisonOperator');
  const [value = '', updateValue] = useInput<ThresholdValue | ThresholdValue[]>(path + '.value');
  const [componentTag] = useInput<AppKitComponentTag>('componentTag');
  const [thresholdValueList, updateThresholdValueList] = useState<ThresholdValue[]>(Array.isArray(value) ? value : []);

  const COMPARISON_OPERATOR_OPTIONS: SelectProps.Option[] = [
    { label: '>', value: COMPARISON_OPERATOR.GREATER_THAN },
    { label: '<', value: COMPARISON_OPERATOR.LESS_THAN },
    { label: '=', value: COMPARISON_OPERATOR.EQUAL },
    { label: '>=', value: COMPARISON_OPERATOR.GREATER_THAN_EQUAL },
    { label: '<=', value: COMPARISON_OPERATOR.LESS_THAN_EQUAL },
    {
      label: thresholdSettings.containsLabel,
      value: COMPARISON_OPERATOR.CONTAINS,
      disabled: !widgetsSupportsContainOp.find((tag) => tag === componentTag),
    },
  ];

  const [invalid, updateInvalid] = useState<boolean>();
  const notAllowString = !OPS_ALLOWED_WITH_STRING.find((op) => comparisonOperator === op);
  const validateValue = () => {
    const parsedValue = parseFloat(value as string);
    if (value === '') {
      return updateInvalid(true);
    }

    if (Number.isNaN(parsedValue) && notAllowString) {
      return updateInvalid(true);
    }

    updateInvalid(false);
  };

  useEffect(validateValue, [value, comparisonOperator]);
  const onTokenDismiss: NonCancelableEventHandler<TokenGroupProps.DismissDetail> = ({ detail: { itemIndex } }) => {
    updateThresholdValueList(thresholdValueList.filter((threshold, index) => itemIndex !== index));
  };

  const selectedOption =
    COMPARISON_OPERATOR_OPTIONS.find(({ value = '' }) => value === comparisonOperator) ||
    COMPARISON_OPERATOR_OPTIONS[0];

  const onUpdateComparator: NonCancelableEventHandler<SelectProps.ChangeDetail> = ({ detail }) => {
    updateComparator(detail.selectedOption.value as COMPARISON_OPERATOR);
  };

  const onUpdateThresholdValue: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail }) => {
    const value = parseFloat(detail.value);
    updateValue(Number.isNaN(value) ? detail.value : value);
  };


  return (
    <Grid
      gridDefinition={[{ colspan: 10 }, { colspan: 2 }, { colspan: 12 }]}
      disableGutters
      data-test-id="threshold-component"
    >
      <div className="threshold-content-item">
        <span className="threshold-content-item label with-gutter">{thresholdSettings.if}</span>
        <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]} disableGutters>
          <div className="threshold-content-item with-gutter grow">
            <Select
              options={COMPARISON_OPERATOR_OPTIONS}
              selectedOption={selectedOption}
              onChange={onUpdateComparator}
              data-test-id="threshold-component-operator-select"
            />
          </div>
          <div className="threshold-content-item with-gutter grow">
            <Input
              value={`${value}`}
              inputMode={notAllowString ? 'numeric' : 'text'}
              type={notAllowString ? 'number' : 'text'}
              placeholder="Threshold value"
              onChange={onUpdateThresholdValue}
              invalid={invalid}
              data-test-id="threshold-component-value-input"
            />
          </div>
        </Grid>
        <div className="threshold-content-item ">
          <ColorPicker
            color={color}
            updateColor={updateThresholdColor}
            data-test-id="threshold-component-color-picker"
          />
        </div>
      </div>

      <div className="threshold-content-item justify-content-end">
        <Button iconName="close" variant="icon" onClick={deleteSelf} data-test-id="threshold-component-delete-button" />
      </div>

      <TokenGroup items={thresholdValueList.map((value) => ({ label: value as string }))} onDismiss={onTokenDismiss} />
    </Grid>
  );
};
