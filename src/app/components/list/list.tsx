import "./list.css";
import React from 'react';

interface ListProps<T> {
  type?: "table" | "list";
  gap?: string;
  items: T[];
  renderItem: (item: T, index: number, stagger?: string) => React.ReactNode;
}

const List = <T,>({ type, gap, items, renderItem }: ListProps<T>) => {

  const delay = 200;
  const stagger = 100;
  const getStagger = (index: number) => (delay + (index * stagger));

  const renderListItem = (item: T, index: number) => {
    return (
      <li key={index} style={ { animationDelay: (`${getStagger(index)}ms`) } }>
        {renderItem(item, index)}
      </li>
    );
  };

  switch (type) {
    case "table":
      return (
        <table>
          <tbody className='list'>
            {items.map((item, index) => renderItem(item, index, (`${getStagger(index)}ms`)))}
          </tbody>
        </table>
      );
    case undefined:
    case "list":
      return (
        <ul className='list' style={ { gap } }>
          {items.map((item, index) => renderListItem(item, index))}
        </ul>
      );
  }
};

export default List;
