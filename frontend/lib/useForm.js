import { useState, useEffect } from 'react';

export default function useForm(initial = {}) {
  // create a state
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    // when inputs change
    setInputs(initial);
  }, [initialValues]);

  function handleChange(e) {
    let { name, value, type } = e.target;

    if (type === 'number') {
      value = parseInt(value);
    }

    if (type === 'file') {
      // get the first element of files array
      [value] = e.target.files;
    }

    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
