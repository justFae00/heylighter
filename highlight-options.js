function buildActionOptions(
  currentData,
  onColorClick,
  onUnderlineClick,
  onRemoveClick,
) {
  const colors = [
    "rgba(255, 105, 180, 0.4)", // pink
    "rgba(255, 215, 0, 0.4)", // yellow
    "rgba(60, 179, 113, 0.4)", // green
    "rgba(30, 144, 255, 0.4)", // blue
  ];
  const colorOptions = colors.map((color) => ({
    isColorCircle: true,
    color,
    active: currentData.color === color,
    onClick: () => onColorClick(color),
  }));

  const underlineOption = {
    label: "U",
    active: currentData.underlined,
    onClick: onUnderlineClick,
  };

  const removeOption = {
    label: "🗑",
    onClick: onRemoveClick,
  };

  return [...colorOptions, underlineOption, removeOption];
}
