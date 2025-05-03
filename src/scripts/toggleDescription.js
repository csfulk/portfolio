export const toggleDescription = (isExpanded, setIsExpanded) => {
  console.log(`toggleDescription called. Current isExpanded: ${isExpanded}`);
  setIsExpanded(!isExpanded); // Toggle between expanded and truncated
};