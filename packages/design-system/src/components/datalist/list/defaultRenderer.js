/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { forwardRef } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Option, Selected, OverflowEllipses } from './styled';

const DefaultRenderer = forwardRef(function DefaultRenderer(
  { option, value, ...rest },
  ref
) {
  return (
    <Option key={option.id} {...rest} ref={ref}>
      {value === option.id && (
        <Selected aria-label={__('Selected', 'web-stories')} />
      )}
      <OverflowEllipses>{option.name}</OverflowEllipses>
    </Option>
  );
});

DefaultRenderer.propTypes = {
  option: PropTypes.object.isRequired,
  value: PropTypes.any,
};

export default DefaultRenderer;