import { useEffect } from 'react';
import ReactTags, { SuggestionComponentProps, TagComponentProps } from 'react-tag-autocomplete';
import ColorGenerator from '../../utils/services/ColorGenerator';
import { TagsList } from '../reducers/tagsList';
import TagBullet from './TagBullet';
import Tag from './Tag';

export interface TagsSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

interface TagsSelectorConnectProps extends TagsSelectorProps {
  listTags: Function;
  tagsList: TagsList;
}

const toComponentTag = (tag: string) => ({ id: tag, name: tag });

const TagsSelector = (colorGenerator: ColorGenerator) => (
  { selectedTags, onChange, listTags, tagsList, placeholder = 'Add tags to the URL' }: TagsSelectorConnectProps,
) => {
  useEffect(() => {
    listTags();
  }, []);

  const ReactTagsTag = ({ tag, onDelete }: TagComponentProps) =>
    <Tag colorGenerator={colorGenerator} text={tag.name} clearable className="react-tags__tag" onClose={onDelete} />;
  const ReactTagsSuggestion = ({ item }: SuggestionComponentProps) => (
    <>
      <TagBullet tag={`${item.name}`} colorGenerator={colorGenerator} />
      {item.name}
    </>
  );

  return (
    <ReactTags
      tags={selectedTags.map(toComponentTag)}
      tagComponent={ReactTagsTag}
      suggestions={tagsList.tags.filter((tag) => !selectedTags.includes(tag)).map(toComponentTag)}
      suggestionComponent={ReactTagsSuggestion}
      allowNew
      addOnBlur
      placeholderText={placeholder}
      minQueryLength={1}
      delimiters={[ 'Enter', 'Tab', ',' ]}
      onDelete={(removedTagIndex) => {
        const tagsCopy = [ ...selectedTags ];

        tagsCopy.splice(removedTagIndex, 1);
        onChange(tagsCopy);
      }}
      onAddition={({ name: newTag }) => onChange(
        // * Avoid duplicated tags (thanks to the Set),
        // * Split any of the new tags by comma, allowing to paste multiple comma-separated tags at once.
        [ ...new Set([ ...selectedTags, ...newTag.toLowerCase().split(',') ]) ],
      )}
    />
  );
};

export default TagsSelector;
