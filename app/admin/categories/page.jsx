import Link from 'next/link';
import { fetchAllCategories, deleteCategory } from '@/actions/category-actions';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';
import { requireAdmin } from '@/lib/auth-guard';

const AdminCategoriesPage = async (props) => {
  await requireAdmin();

  const searchParams = await props.searchParams;
  // const { searchParams } = props;
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';

  const categories = await fetchAllCategories({
    query: searchText,
    page,
  });

  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <h1 className='h2-bold'>Categories</h1>
          {searchText && (
            <div>
              Filtered by <i>&quot;{searchText}&quot;</i>{' '}
              <Link href='/admin/categories' className='inline'>
                <Button variant='outline' size='sm'>
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant='default'>
          <Link href='/admin/categories/create'>Create Category</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CATEGORY ID</TableHead>
            <TableHead>CATEGORY NAME</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>IS ACTIVE?</TableHead>
            <TableHead className='w-[100px]'>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{(category.id)}</TableCell>
              <TableCell>{category.category_name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.isactive ? 'Yes' : 'No'}</TableCell>
              <TableCell className='flex gap-1'>
                <Button asChild variant='outline' size='sm'>
                  <Link href={`/admin/categories/${category.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={category.id} action={deleteCategory} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {categories.totalPages > 1 && (
        <Pagination page={page} totalPages={categories.totalPages} />
      )}
    </div>
  );
};

export default AdminCategoriesPage;