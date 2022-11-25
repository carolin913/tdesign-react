import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import Popup, { PopupRef } from '../popup';
import useConfig from '../hooks/useConfig';
import { TdTooltipProps } from './type';
import { tooltipDefaultProps } from './defaultProps';

export type TooltipProps = TdTooltipProps;

export interface TooltipRef extends PopupRef {
  setVisible?: (v: boolean) => void;
}

const Tooltip = forwardRef((props: TdTooltipProps, ref) => {
  const { theme, showArrow, destroyOnClose, overlayClassName, children, duration, placement, ...restProps } = props;

  const { classPrefix } = useConfig();
  const [isTipShowed, setTipshow] = useState(duration !== 0);
  const [timeup, setTimeup] = useState(false);
  const popupRef = useRef<PopupRef>();
  const timerRef = useRef<number | null>(null);
  const toolTipClass = classNames(
    `${classPrefix}-tooltip`,
    {
      [`${classPrefix}-tooltip--${theme}`]: theme,
    },
    overlayClassName,
  );

  const setVisible = (v: boolean) => {
    if (duration !== 0) setTimeup(false);
    setTipshow(v);
  };

  const handleShowTip = (visible: boolean) => {
    if (duration === 0 || (duration !== 0 && timeup)) {
      setTipshow(visible);
    }
  };

  useEffect(() => {
    if (duration !== 0 && !timeup) {
      timerRef.current = window.setTimeout(() => {
        setTipshow(false);
        setTimeup(true);
      }, duration);
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [duration, timeup]);

  useImperativeHandle(ref, () => ({
    setVisible,
    ...((popupRef.current || {}) as any),
  }));

  return (
    <Popup
      ref={popupRef}
      destroyOnClose={destroyOnClose}
      showArrow={showArrow}
      overlayClassName={toolTipClass}
      visible={isTipShowed}
      onVisibleChange={handleShowTip}
      placement={placement}
      {...restProps}
    >
      {children}
    </Popup>
  );
});

Tooltip.displayName = 'Tooltip';
Tooltip.defaultProps = tooltipDefaultProps;

export default Tooltip;
