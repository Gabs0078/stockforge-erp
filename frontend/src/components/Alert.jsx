import React from 'react';
export default function Alert({ type = 'danger', message }) {
  if (!message) return null;
  return <div className={`alert alert-${type}`} role="alert">{message}</div>;
}
