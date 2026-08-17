import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateAddressDto } from '../common/dto/create-address.dto';
import { UpdateAddressDto } from '../common/dto/update-address.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/users.service';

const addressSelect = {
  id: true,
  province: true,
  city: true,
  details: true,
  plaque: true,
  postalCode: true,
  latitude: true,
  longitude: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.AddressSelect;

export type PublicAddress = Prisma.AddressGetPayload<{
  select: typeof addressSelect;
}>;

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  create(_actor: PublicUser, dto: CreateAddressDto): Promise<PublicAddress> {
    return this.prisma.address.create({
      data: {
        province: dto.province,
        city: dto.city,
        details: dto.details,
        plaque: dto.plaque,
        postalCode: dto.postalCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      select: addressSelect,
    });
  }

  async findOne(_actor: PublicUser, id: string): Promise<PublicAddress> {
    const address = await this.prisma.address.findUnique({
      where: { id },
      select: addressSelect,
    });

    if (!address) {
      throw new NotFoundException(`Address ${id} not found`);
    }

    return address;
  }

  async update(
    actor: PublicUser,
    id: string,
    dto: UpdateAddressDto,
  ): Promise<PublicAddress> {
    await this.findOne(actor, id);

    return this.prisma.address.update({
      where: { id },
      data: {
        province: dto.province,
        city: dto.city,
        details: dto.details,
        plaque: dto.plaque,
        postalCode: dto.postalCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      select: addressSelect,
    });
  }
}
