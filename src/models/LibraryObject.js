import BaseObject from './BaseObject';

export default class LibraryObject extends BaseObject {
    constructor(params, geometry, material) {
        super(params, geometry, material);

        this.sections = {};
        this.books = {};
    }

    addSection(section) {
        this.add(section);
        this.addToDict(this.sections, section);
    }

    addBook(book) {
        this.placeBookOnShelf(book);
        this.addToDict(this.books, book);
    }

    placeBookOnShelf(book) {
        var shelf = this.getBookShelf(book.dataObject);
        shelf.add(book);
    }

    /**
     * @param {String} sectionId - Section Id
     * @returns {lib3d.SectionObject} An instance of a section
     */
    getSection(sectionId) {
        return this.getDictObject(this.sections, sectionId);
    }

    /**
     * @param {String} sectionId - Section Id
     * @param {String} shelfId - Shelf Id
     * @returns {lib3d.SectionObject} An instance of a shelf
     */
    getShelf(sectionId, shelfId) {
        var section = this.getSection(sectionId);
        var shelf = section && section.shelves[shelfId];

        return shelf;
    }

    getBookShelf(bookDto) {
        return this.getShelf(bookDto.sectionId, bookDto.shelfId);
    }

    /**
     * @param {String} bookId - Book Id
     * @returns {lib3d.BookObject} An instance of a book
     */
    getBook(bookId) {
        return this.getDictObject(this.books, bookId);
    }

    /** Removes section from the library
     * @param {String} id - Section Id
     */
    removeSection(id) {
        this.removeObject(this.sections, id);
    }

    /** Removes book from the library
     * @param {String} id - Book Id
     */
    removeBook(id) {
        this.removeObject(this.books, id);
    }

    addToDict(dict, obj) {
        var dictItem = {
            dto: obj.dataObject,
            obj: obj
        };

        dict[obj.getId()] = dictItem;
    }

    getDictObject(dict, objectId) {
        var dictItem = dict[objectId];
        var dictObject = dictItem && dictItem.obj;

        return dictObject;
    }

    removeObject(dict, key) {
        var dictItem = dict[key];

        if(dictItem) {
            delete dict[key];
            
            if(dictItem.obj) {
                dictItem.obj.setParent(null);
            }
        }
    }
}
