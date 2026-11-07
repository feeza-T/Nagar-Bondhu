
import useTranslatedText from '../../hooks/useTranslatedText';

export default function TranslatedText({ text, as: Component = 'span', className = '' }) {
  const translated = useTranslatedText(text);

  return (
    <Component className={className}>
      {translated}
    </Component>
  );
}
