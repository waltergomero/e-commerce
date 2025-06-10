import Link from 'next/link';
import { fetchAllBrands, deleteBrand } from '@/actions/brand-actions';
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
import { formatId } from '@/lib/utils';

const AdminBrandsPage = async (props) => {
  await requireAdmin();

  const searchParams = await props.searchParams;
  // const { searchParams } = props;
  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';

  const brands = await fetchAllBrands({
    query: searchText,
    page,
  });

  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <h1 className='h3-bold'>Brands</h1>
          {searchText && (
            <div>
              Filtered by <i>&quot;{searchText}&quot;</i>{' '}
              <Link href='/admin/brands' className='inline'>
                <Button variant='outline' size='sm'>
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant='default'>
          <Link href='/admin/brands/create'>Create Brand</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>BRAND ID</TableHead>
            <TableHead>BRAND NAME</TableHead>
            <TableHead>DESCRIPTION</TableHead>
            <TableHead>IS ACTIVE?</TableHead>
            <TableHead className='w-[100px]'>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands?.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell>{formatId(brand.id)}</TableCell>
              <TableCell>{brand.brand_name}</TableCell>
              <TableCell>{brand.description}</TableCell>
              <TableCell>{brand.isactive ? 'Yes' : 'No'}</TableCell>
              <TableCell className='flex gap-1'>
                <Button asChild variant='outline' size='sm'>
                  <Link href={`/admin/brands/${brand.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={brand.id} action={deleteBrand} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {brands.totalPages > 1 && (
        <Pagination page={page} totalPages={brands.totalPages} />
      )}
    </div>
  );
};

export default AdminBrandsPage;