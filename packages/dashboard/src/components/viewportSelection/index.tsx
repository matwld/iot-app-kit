import React from 'react';

import { useDispatch } from 'react-redux';

import DateRangePicker from '@cloudscape-design/components/date-range-picker';
import { onUpdateViewportAction } from '~/store/actions';

import { dateRangeToViewport, relativeOptions, viewportToDateRange } from './viewportAdapter';
import type { DateRangePickerProps } from '@cloudscape-design/components/date-range-picker';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import type { DashboardConfiguration } from '~/types';
import type { DashboardMessages } from '~/messages';

export type ViewportSelectionProps = {
  viewport: DashboardConfiguration['viewport'];
  messageOverrides: DashboardMessages;
  expandToViewport?: boolean;
};

const rangeValidator =
  ({
    dateRangeIncompleteError,
    dateRangeInvalidError,
  }: {
    dateRangeIncompleteError: string;
    dateRangeInvalidError: string;
  }): DateRangePickerProps.ValidationFunction =>
  (range: DateRangePickerProps.Value | null) => {
    if (range?.type === 'absolute') {
      const [startDateWithoutTime] = range.startDate.split('T');
      const [endDateWithoutTime] = range.endDate.split('T');
      if (!startDateWithoutTime || !endDateWithoutTime) {
        return {
          valid: false,
          errorMessage: dateRangeIncompleteError,
        };
      }
      const startTime = new Date(range.startDate).getTime();
      const endTime = new Date(range.endDate).getTime();
      if (startTime - endTime > 0) {
        return {
          valid: false,
          errorMessage: dateRangeInvalidError,
        };
      }
    }
    return { valid: true };
  };

const ViewportSelection: React.FC<ViewportSelectionProps> = ({
  expandToViewport = true,
  viewport,
  messageOverrides,
}) => {
  const dispatch = useDispatch();

  const handleChangeDateRange: NonCancelableEventHandler<DateRangePickerProps.ChangeDetail> = (event) => {
    const { value } = event.detail;

    if (!value) return;

    const viewport = dateRangeToViewport(value);

    dispatch(
      onUpdateViewportAction({
        viewport,
      })
    );
  };

  const { title, placeholder, dateRangeIncompleteError, dateRangeInvalidError, ...i18nStrings } =
    messageOverrides.viewport;

  return (
    <div className='viewport-selection iot-dashboard-toolbar-viewport'>
      <h1 className='iot-dashboard-toolbar-title'>{title}</h1>
      <DateRangePicker
        expandToViewport={expandToViewport}
        onChange={handleChangeDateRange}
        value={viewportToDateRange(viewport)}
        showClearButton={false}
        relativeOptions={relativeOptions}
        isValidRange={rangeValidator({ dateRangeIncompleteError, dateRangeInvalidError })}
        i18nStrings={i18nStrings}
        placeholder={placeholder}
      />
    </div>
  );
};

export default ViewportSelection;
