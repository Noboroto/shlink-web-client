import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ShortUrlsTable as shortUrlsTableCreator } from '../../src/short-urls/ShortUrlsTable';
import { OrderableFields, SORTABLE_FIELDS } from '../../src/short-urls/reducers/shortUrlsListParams';
import { ShortUrlsList } from '../../src/short-urls/reducers/shortUrlsList';
import { ReachableServer, SelectedServer } from '../../src/servers/data';

describe('<ShortUrlsTable />', () => {
  let wrapper: ShallowWrapper;
  const shortUrlsList = Mock.all<ShortUrlsList>();
  const orderByColumn = jest.fn();
  const ShortUrlsRow = () => null;
  const ShortUrlsTable = shortUrlsTableCreator(ShortUrlsRow);

  const createWrapper = (server: SelectedServer = null) => {
    wrapper = shallow(
      <ShortUrlsTable shortUrlsList={shortUrlsList} selectedServer={server} orderByColumn={() => orderByColumn} />,
    );

    return wrapper;
  };

  beforeEach(() => createWrapper());
  afterEach(jest.resetAllMocks);
  afterEach(() => wrapper?.unmount());

  it('should render inner table by default', () => {
    expect(wrapper.find('table')).toHaveLength(1);
  });

  it('should render table header by default', () => {
    expect(wrapper.find('table').find('thead')).toHaveLength(1);
  });

  it('should render 6 table header cells by default', () => {
    expect(wrapper.find('table').find('thead').find('tr').find('th')).toHaveLength(6);
  });

  it('should render 6 table header cells without order by icon by default', () => {
    const thElements = wrapper.find('table').find('thead').find('tr').find('th');

    thElements.forEach((thElement) => {
      expect(thElement.find(FontAwesomeIcon)).toHaveLength(0);
    });
  });

  it('should render table header cells with conditional order by icon', () => {
    const getThElementForSortableField = (orderableField: string) => wrapper.find('table')
      .find('thead')
      .find('tr')
      .find('th')
      .filterWhere((e) => e.text().includes(SORTABLE_FIELDS[orderableField as OrderableFields]));
    const sortableFields = Object.keys(SORTABLE_FIELDS).filter((sortableField) => sortableField !== 'title');

    expect.assertions(sortableFields.length);
    sortableFields.forEach((sortableField) => {
      getThElementForSortableField(sortableField).simulate('click');
      expect(orderByColumn).toHaveBeenCalled();
    });
  });

  it.each([
    [ '2.6.0' ],
    [ '2.6.1' ],
    [ '2.7.0' ],
    [ '3.0.0' ],
  ])('should render composed column when server supports title', (version) => {
    const wrapper = createWrapper(Mock.of<ReachableServer>({ version }));
    const composedColumn = wrapper.find('table').find('th').at(2);
    const text = composedColumn.text();

    expect(text).toContain('Title');
    expect(text).toContain('Long URL');
  });
});
