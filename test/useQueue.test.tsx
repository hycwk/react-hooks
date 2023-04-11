import { renderHook, act } from "@testing-library/react-hooks";
import { useQueue } from "../src/useQueue";

const items = [
  { id: "item1" },
  { id: "item2" },
  { id: "item3" },
  { id: "item4" },
  { id: "item5" },
];

/**
 * TEST:
 * [✔] should return default 
 * [✔] should return blank queue
 * [✔] should add item to the queue end
 * [✔] should have item when add item into blank state
 * [✔] should generate id that can remove item when adding a item without id
 * [✔] should not change the queue when add item with duplicate id
 * [✔] should remove item that matches input id 
 * [✔] should not change the queue when remove item with non-exist id
 * [✔] should remove item that id is generated by add item function
 * [] should generate queue id and keep id undefined when new item has no id
 */
describe("test useQueue", () => {
  test("should return default", () => {
    const { result } = renderHook(() =>
      useQueue()
    );
		act(() => {
			result.current.add(items[0])
			result.current.add(items[1])
			result.current.add(items[2])
		})
    expect(result.current.queue).toMatchObject([items[0], items[1], items[2]]);
  });

	test("should return blank queue", () => {
    const { result } = renderHook(() =>
      useQueue()
    );
    expect(result.current.queue).toMatchObject([]);
    expect(result.current.head).toBeUndefined();
  });

  test("should add item to the queue end", () => {
    const { result } = renderHook(() =>
      useQueue()
    );
		act(() => {
			result.current.add(items[0])
			result.current.add(items[1])
			result.current.add(items[2])
		})
    expect(result.current.queue).toMatchObject([items[0], items[1], items[2]]);
		act(() => {
			result.current.add(items[3])
		})
    expect(result.current.queue).toMatchObject([items[0], items[1], items[2], items[3]]);
  });

  test("should have item when add item into blank state", () => {
    const { result } = renderHook(() =>
      useQueue()
    );
		act(() => {
			result.current.add(items[3])
		})
    expect(result.current.queue).toMatchObject([items[3]]);
  });

	test('should generate id that can remove item when adding a item without id', () => { 
		let noIdItem: { name: string; id?: string; } = {
			name: 'noIdItem'
		}
		let generatedId = '';
		const { result } = renderHook(() => 
			useQueue()
		)
		act(() => {
			generatedId = result.current.add(noIdItem);
		})
    expect(result.current.queue).toMatchObject([noIdItem]);
		act(() => {
			result.current.removeById(generatedId);
		})
    expect(result.current.queue).toMatchObject([]);
	})

	test('should not change the queue when add item with duplicate id', () => {
		const duplicatedIDItem = {
			id: "item1",
			name: "item1"
		}
		const { result } = renderHook(() => useQueue());
		act(() => {
			result.current.add(items[0])
			result.current.add(items[1])
			result.current.add(items[2])
		})
    expect(result.current.queue).toMatchObject([items[0], items[1], items[2]]);
		act(() => {
			result.current.add(duplicatedIDItem);
		})
    expect(result.current.queue).toMatchObject([items[0], items[1], items[2]]);
	})

  test("should remove item that matches input id", () => {
    
		const { result } = renderHook(() => useQueue());
		act(() => {
			result.current.add(items[0])
			result.current.add(items[1])
			result.current.add(items[2])
		})
    expect(result.current.queue).toMatchObject([items[0], items[1], items[2]]);
		act(() => {
			result.current.removeById('item1')
		})
    expect(result.current.queue).toMatchObject([items[1], items[2]]);
  });

	test('should not change the queue when remove item with non-exist id', () => { 
    
		const { result } = renderHook(() => useQueue());
		act(() => {
			result.current.add(items[0])
			result.current.add(items[1])
			result.current.add(items[2])
		})
    expect(result.current.queue).toMatchObject([items[0], items[1], items[2]]);
		act(() => {
			result.current.removeById('IDNonExists')
		})
    expect(result.current.queue).toMatchObject([items[0], items[1], items[2]]); 
	})

	test('should remove the item that id is generated by add item function', () => { 
		let tempID = '';
		const { result } = renderHook(() =>
			useQueue()
		)
		act(() => {
			// items[0] has ID;
			tempID = result.current.add(items[0])
		})
		act(() => {
			// items[1] has ID;
			tempID = result.current.add(items[1])
		})
    expect(result.current.queue).toMatchObject([items[0], items[1]]); 
		act(() => {
			result.current.removeById(tempID)
		})
    expect(result.current.queue).toMatchObject([items[0]]); 
		const noIdItem = {
			name: 'noIdItem',
			id: undefined
		}
		act(() => {
			// noIdItem has no ID;
			tempID = result.current.add(noIdItem);
		})
    expect(result.current.queue).toMatchObject([items[0], noIdItem]); 
		act(() => {
			result.current.removeById(tempID)
		})
    expect(result.current.queue).toMatchObject([items[0]]); 
	})

	test('should generate queue id and keep id undefined when new item has no id', () => { 
		let tempID = '';
		const noIdItem = {
			name: 'noIdItem',
			id: undefined
		}
		const { result } = renderHook(() =>
			useQueue()
		)
		act(() => {
			tempID = result.current.add(noIdItem);
		})
		// tempID === noIdItem.queueId
    expect(result.current.queue[0].queueId).toBe(tempID); 
    expect(result.current.queue[0].id).toBe(undefined); 
	})
});
