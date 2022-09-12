import * as React from 'react';

interface DividerProps {
  noMargin?: boolean;
  noMarginTop?: boolean;
  noMarginBottom?: boolean;
  extraClasses?: string;
}

function Divider({
  noMargin = false,
  noMarginTop = false,
  noMarginBottom = false,
  extraClasses = '',
}: DividerProps) {
  return (
    <div
      className={`divider ${noMarginTop || noMargin ? 'no-margin-top' : ''} ${
        noMarginBottom || noMargin ? 'no-margin-bottom' : ''
      } ${extraClasses}`}
    />
  );
}

Divider.defaultProps = {
  noMargin: false,
  noMarginTop: false,
  noMarginBottom: false,
  extraClasses: '',
};

export default Divider;
