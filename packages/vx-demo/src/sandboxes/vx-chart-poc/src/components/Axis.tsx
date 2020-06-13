import React, { useContext, useMemo } from 'react';
import BaseAxis, { AxisProps as BaseAxisProps } from '@vx/axis/lib/axis/Axis';

import ChartContext from '../context/ChartContext';
import { ScaleOutput } from '../types';

type AxisProps<ScaleInpu> = Omit<BaseAxisProps<ScaleInpu>, 'scale'>;

export default function Axis<ScaleInput = unknown>(props: AxisProps<ScaleInput>) {
  const { theme, xScale, yScale, margin } = useContext(ChartContext);
  const { orientation } = props;

  // The biggest difference between Axes is their label + tick label styles
  // we take this from props if specified, else we figure it out from the chart theme
  const themeTickStylesKey =
    orientation === 'left' || orientation === 'right' ? 'yTickStyles' : 'xTickStyles';

  const tickStyles = useMemo(() => theme[themeTickStylesKey], [theme, themeTickStylesKey]);

  const tickLabelProps = useMemo(() => {
    if (props.tickLabelProps) return props.tickLabelProps;
    const themeTickLabelProps = theme?.[themeTickStylesKey]?.label?.[orientation];
    return themeTickLabelProps
      ? // by default, wrap tick labels within the allotted margin space
        () => ({ ...themeTickLabelProps, width: margin[orientation] })
      : undefined;
  }, [theme, props.tickLabelProps, themeTickStylesKey, orientation, margin]);

  // extract axis styles from theme
  const themeAxisStylesKey =
    orientation === 'left' || orientation === 'right' ? 'yAxisStyles' : 'xAxisStyles';

  const axisStyles = useMemo(() => theme[themeAxisStylesKey], [theme, themeAxisStylesKey]);

  // early return if scale is not available in context
  if (!xScale || !yScale) return null;

  const topOffset =
    orientation === 'bottom'
      ? Math.max(...(yScale.range() as ScaleOutput[])) || 0
      : orientation === 'top'
      ? Math.min(...(yScale.range() as ScaleOutput[])) || 0
      : 0;
  const leftOffset =
    orientation === 'left'
      ? Math.min(...(xScale.range() as ScaleOutput[])) ?? 0
      : orientation === 'right'
      ? Math.max(...(xScale.range() as ScaleOutput[])) ?? 0
      : 0;

  return (
    <BaseAxis<ScaleInput>
      top={topOffset}
      left={leftOffset}
      labelProps={axisStyles?.label?.[orientation]}
      stroke={axisStyles?.stroke}
      strokeWidth={axisStyles?.strokeWidth}
      tickLength={tickStyles?.tickLength}
      tickStroke={tickStyles?.stroke}
      {...props}
      tickLabelProps={tickLabelProps}
      scale={orientation === 'left' || orientation === 'right' ? yScale : xScale}
    />
  );
}