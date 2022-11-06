import React, { useEffect, useState } from "react";

function getValue(key, value) {
  const valueFromStorage = JSON.parse(localStorage.getItem(key));
  if (valueFromStorage) return valueFromStorage;
  if (value instanceof Function) return value();
  return value;
}

function useLocalStorage(key, initialValue){
  const [value, setValue] = useState(() => {
    return getValue(key, initialValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
};
export default useLocalStorage;
