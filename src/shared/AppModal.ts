import type { ComponentType } from 'react';
import ReactModal from 'react-modal';

// @types/react-modal is typed against an older React.Component signature that
// is no longer structurally compatible with @types/react 19.x, so we cast
// it once here instead of sprinkling `as any` across every modal.
export const AppModal = ReactModal as unknown as ComponentType<ReactModal.Props>;
