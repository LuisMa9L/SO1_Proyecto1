#include <linux/proc_fs.h>
#include <linux/seq_file.h> 
#include <asm/uaccess.h> 
#include <linux/hugetlb.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/kernel.h>   
#include <linux/fs.h>

#define BUFSIZE  	150

MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("SOFTWARE PARA VER EL ESTADO DEL CPU");
MODULE_AUTHOR("Romeo Axpuac -  201314474  y Soy.LmmL 201314160");




static int escribir_archivo(struct seq_file * archivo, void *v) {	
   	
	seq_printf(archivo, "  Carnet: 201314474_201314160                      \n");
    	seq_printf(archivo, "  Bayron Romeo Axpuac Yoc y Luis Manuel Morales Lopez\n");
    	seq_printf(archivo, "  DOCH S.A. :D                 			   \n");
 	struct task_struct *task;
	struct task_struct *task_child;
	struct list_head *list;
	for_each_process( task ){
		seq_printf(archivo,"\nID->:	%d PROCESO->:	%s ESTADO->:	%ld",task->pid, task->comm, task->state);
		list_for_each(list, &task->children){
			task_child = list_entry( list, struct task_struct, sibling );
			seq_printf(archivo,"\n		PADRE->:	%s[%d] ID->:	%d PROCESO:->	%s ESTADO->:	%ld",task->comm, task->pid,task_child->pid, task_child->comm, task_child->state);
		}
	}
       
	return 0;
}

static int al_abrir(struct inode *inode, struct  file *file) {
  return single_open(file, escribir_archivo, NULL);
}

static struct file_operations operaciones =
{    
    .open = al_abrir,
    .read = seq_read
};

static int iniciar(void)
{
    proc_create("cpu_201314474_201314160", 0, NULL, &operaciones);
    printk(KERN_INFO "Carnet: 201314474_201314160\n");
    return 0;
}
 
static void salir(void)
{
    remove_proc_entry("cpu_201314474_201314160", NULL);
    printk(KERN_INFO "Curso: Sistemas Operativos 1\n");
}
 
module_init(iniciar);
module_exit(salir); 
