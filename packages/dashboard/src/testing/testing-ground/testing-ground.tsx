import { Component, State, h } from '@stencil/core';
import { DashboardConfiguration } from '../../types';
import { dashboardConfig } from '../mocks';
import { XAnnotation } from '@synchro-charts/core';
import { addXAnnotation, editXAnnotation, deleteXAnnotation } from '../../dashboard-actions/annotations';
import { viewportEndDate, viewportStartDate } from '@iot-app-kit/core';

const DEFAULT_LIST_VISIBLE_ANNOTATIONS = false;

@Component({
  tag: 'testing-ground',
  styleUrl: 'testing-ground.css',
})
export class TestingGround {
  @State() dashboardConfiguration: DashboardConfiguration = dashboardConfig;
  @State() selectedWidgetId = this.dashboardConfiguration.widgets[0].id;
  @State() onlyListVisibleAnnotations = DEFAULT_LIST_VISIBLE_ANNOTATIONS;

  onListVisibleAnnotations = (e: Event) => {
    this.onlyListVisibleAnnotations = (e as any).target.checked;
  };

  /**
   * Modify annotation data based on input from UI
   */
  selectWidget = (e: Event) => {
    e.preventDefault();
    const widgetId = (e as any).target.value;
    this.selectedWidgetId = widgetId;
  };

  addAnnotation = (e: Event) => {
    e.preventDefault();
    const labelInput = (e as any).target[0].value;
    const annotationLabel = { text: labelInput, show: true };
    const colorInput = (e as any).target[1].value;
    const dateInput = (e as any).target[2].value;
    const newDate = new Date(dateInput);
    const XANNOTATION: XAnnotation = {
      color: colorInput,
      value: newDate,
      id: Date.now().toString(),
      showValue: true,
      label: annotationLabel,
    };
    const newWidgets = addXAnnotation({
      dashboardConfiguration: this.dashboardConfiguration,
      widgetId: this.selectedWidgetId,
      annotation: XANNOTATION,
    });
    this.dashboardConfiguration = { ...this.dashboardConfiguration, widgets: newWidgets };
  };

  deleteAnnotation = (e: Event) => {
    if (window.confirm('Delete annotation?')) {
      e.preventDefault();
      const stringInput = (e as any).target[0].value;
      const newWidgets = deleteXAnnotation({
        dashboardConfiguration: this.dashboardConfiguration,
        widgetId: this.selectedWidgetId,
        annotationIdToDelete: stringInput,
      });
      this.dashboardConfiguration = { ...this.dashboardConfiguration, widgets: newWidgets };
    }
  };

  editAnnotation = (e: Event) => {
    if (window.confirm('Edit annotation?')) {
      e.preventDefault();
      const labelInput = (e as any).target[0].value;
      const annotationLabel = { text: labelInput, show: true };
      const colorInput = (e as any).target[1].value;
      const annotationId = (e as any).target[2].value;
      const dateInput = (e as any).target[3].value;
      const newDate = new Date(dateInput);
      const oldWidget = this.dashboardConfiguration.widgets
        .find((x) => x.id == this.selectedWidgetId)
        ?.annotations?.x?.find((annotation) => annotation.id == annotationId);
      const XANNOTATION: XAnnotation = {
        color: colorInput,
        value: newDate,
        id: annotationId,
        showValue: true,
        label: annotationLabel ? annotationLabel : oldWidget?.label,
      };
      const newWidgets = editXAnnotation({
        dashboardConfiguration: this.dashboardConfiguration,
        widgetId: this.selectedWidgetId,
        newAnnotation: XANNOTATION,
      });
      this.dashboardConfiguration = { ...this.dashboardConfiguration, widgets: newWidgets };
      console.log(this.dashboardConfiguration);
    }
  };

  isVisible = (annotation: XAnnotation) => {
    const start = viewportStartDate(this.dashboardConfiguration.viewport).getTime();
    const end = viewportEndDate(this.dashboardConfiguration.viewport).getTime();
    const annotationTime = annotation.value.getTime();
    return annotationTime >= start && annotationTime <= end;
  };

  render() {
    return (
      <div>
        <iot-resizable-panes>
          <div slot="left">
            <div class="dummy-content">Resource explorer pane</div>
          </div>
          <div slot="center">
            <iot-dashboard dashboardConfiguration={this.dashboardConfiguration}></iot-dashboard>
          </div>
          <div slot="right">
            <div>
              <label htmlFor="selectWidget"> Select widget:</label>
              <select id="selectWidget" onChange={this.selectWidget}>
                {this.dashboardConfiguration.widgets.map((widget) => (
                  <option value={widget.id}>{widget.id.toString() + ', ' + widget.componentTag.toString()}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Only list visible annotations</label>
              <input
                type="checkbox"
                checked={this.onlyListVisibleAnnotations}
                onChange={this.onListVisibleAnnotations}
              />
            </div>
            <br />
            <br />
            <div>
              <form onSubmit={this.addAnnotation}>
                <label htmlFor="addAnnotation"> Add annotation -</label>
                <label htmlFor="addLabel"> Label:</label>
                <input type="text" id="addLabel"></input>
                <input type="color" value="#FF0000"></input>
                <input type="datetime-local" step="1"></input>
                <input type="submit" value="Add" id="addAnnotation" onSubmit={this.addAnnotation}></input>
              </form>
            </div>
            <br />
            <br />
            <div>
              <form onSubmit={this.deleteAnnotation}>
                <label htmlFor="deleteAnnotation"> Delete annotation:</label>
                <select id="deleteAnnotation">
                  {this.onlyListVisibleAnnotations
                    ? this.dashboardConfiguration.widgets
                        .find((x) => x.id == this.selectedWidgetId)
                        ?.annotations?.x?.filter((annotation) => this.isVisible(annotation))
                        .map((annotation) => <option value={annotation.id}>{annotation.value.toString()}</option>)
                    : this.dashboardConfiguration.widgets
                        .find((x) => x.id == this.selectedWidgetId)
                        ?.annotations?.x?.map((annotation) => (
                          <option value={annotation.id}>{annotation.value.toString()}</option>
                        ))}
                </select>
                <input type="submit" value="Delete"></input>
              </form>
            </div>
            <br />
            <br />
            <div>
              <form onSubmit={this.editAnnotation}>
                <label htmlFor="editAnnotation"> Edit annotation - </label>
                <label htmlFor="addLabel"> Label:</label>
                <input type="text" id="addLabel"></input>
                <input type="color" value="#FF0000"></input>
                <br />
                <select id="editAnnotation">
                  {this.onlyListVisibleAnnotations
                    ? this.dashboardConfiguration.widgets
                        .find((x) => x.id == this.selectedWidgetId)
                        ?.annotations?.x?.filter((annotation) => this.isVisible(annotation))
                        .map((annotation) => <option value={annotation.id}>{annotation.value.toString()}</option>)
                    : this.dashboardConfiguration.widgets
                        .find((x) => x.id == this.selectedWidgetId)
                        ?.annotations?.x?.map((annotation) => (
                          <option value={annotation.id}>{annotation.value.toString()}</option>
                        ))}
                </select>
                <input type="datetime-local" step="1"></input>
                <input type="submit" value="Edit"></input>
              </form>
            </div>
            <div class="dummy-content">Component pane</div>
          </div>
        </iot-resizable-panes>
      </div>
    );
  }
}
