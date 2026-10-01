function buildActionOptions(
  currentData,
  onColorClick,
  onUnderlineClick,
  onRemoveClick,
) {
  const colorOptions = HIGHLIGHT_COLORS.map(({ value }) => ({
    isColorCircle: true,
    color: value,
    active: currentData.color === value,
    onClick: () => onColorClick(value),
  }));

  const underlineOption = {
    label: "U",
    active: currentData.underlined,
    onClick: onUnderlineClick,
  };

  const removeOption = { label: "🗑", onClick: onRemoveClick };

  return [...colorOptions, underlineOption, removeOption];
}
